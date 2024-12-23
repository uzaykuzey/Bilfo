package bilfo.demo;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

//YÖK Atlas
@RequestMapping("/yokAtlas")
public class YokAtlasScraper {
    private static final String BASE_URL = "https://yokatlas.yok.gov.tr";
    private static final Map<String, SchoolCounts> highSchools = new HashMap<>();

    // A class to hold both counts
    static class SchoolCounts {
        int totalCount;
        int specificUniCount;

        public SchoolCounts(int totalCount, int specificUniCount) {
            this.totalCount = totalCount;
            this.specificUniCount = specificUniCount;
        }
    }

    @PostMapping("/scrapeSchools")
    public void scrapeSchools() {
        boolean fullSuccess = false;
        WebDriver driver = null;

        try {
            int failedToClickAcc = 0;
            int noOverlayCount  = 0;
            int overlayError = 0;
            int noHSelements = 0;

            ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
            String driverPath = Objects.requireNonNull(classLoader.getResource("chromedriver.exe")).getPath();
            driverPath = driverPath.substring(1);
            System.setProperty("webdriver.chrome.driver", driverPath);

            ChromeOptions options = new ChromeOptions();
            options.addArguments("--headless");

            options.addArguments("--disable-gpu");
            options.addArguments("--window-size=1920,1080");

            driver = new ChromeDriver(options);

            WebDriverWait wait = new WebDriverWait(driver, Duration.ofMillis(2000));

            // 1) Point to the resources folder.
            //    This assumes "src/main/resources" is your resources folder.
            //    If you're running from a packaged JAR/WAR, the code below
            //    may need to be adapted to an external directory instead.
            File resourcesFolder = new File("src/main/resources");

            // Just a safety check — create the folder if it doesn't exist.
            if (!resourcesFolder.exists()) {
                resourcesFolder.mkdirs();
            }

            // 2) Create a File object for highschools_not_ready.txt in the resources folder
            File notReadyFile = new File(resourcesFolder, "highschools_not_ready.txt");

            try (FileWriter writer = new FileWriter(notReadyFile)) {

                // Navigate to the main page
                driver.get(BASE_URL + "/lisans-anasayfa.php");

                // Get list of universities and their IDs
                Document mainPage = Jsoup.parse(driver.getPageSource());
                Elements universities = mainPage.select("select#univ2 option");
                int i=0;
                for (Element uni : universities) {
                    String uniId = uni.attr("value");
                    i++;
                    if(i>3)
                    {
                        break;
                    }
                    if (!uniId.isEmpty()) {
                        String uniUrl = BASE_URL + "/lisans-univ.php?u=" + uniId;

                        // Navigate to the university page
                        driver.get(uniUrl);
                        Document uniPage = Jsoup.parse(driver.getPageSource());
                        Elements departments = uniPage.select("div.panel-primary");

                        for (Element dept : departments) {
                            Element linkElement = dept.select("h4.panel-title a").first();
                            if (linkElement != null) {
                                String deptUrl = linkElement.attr("href");
                                String deptId = deptUrl.split("=")[1];
                                // Navigate to the department page
                                driver.get(BASE_URL + "/lisans.php?y=" + deptId);

                                // Close the pop-up if it appears
                                try {
                                    // Check if the featherlight content is present
                                    if (!driver.findElements(By.cssSelector("div.featherlight-content")).isEmpty()) {
                                        WebElement overlayCloseButton = wait.until(ExpectedConditions.elementToBeClickable(
                                                By.cssSelector("span.featherlight-close-icon.featherlight-close")));
                                        overlayCloseButton.click();
                                        System.out.println("Overlay closed."); // Debug statement
                                    } else {
                                        System.out.println("No overlay present."); // Debug statement
                                        noOverlayCount++;
                                    }
                                } catch (Exception e) {
                                    System.out.println("Error handling overlay: " + e.getMessage());
                                    overlayError++;
                                }

                                int maxRetries = 5; // Maximum number of retries
                                int attempt = 0;
                                boolean success = false;

                                while (attempt < maxRetries && !success) {
                                    try {
                                        // Attempt to click the accordion toggle
                                        WebElement accordionToggle = wait.until(ExpectedConditions.elementToBeClickable(
                                                By.cssSelector("a.accordion-toggle[href='#c1060']")));
                                        accordionToggle.click();
                                        Thread.sleep(1000);
                                        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("icerik_1060")));
                                        System.out.println("Accordion content is visible."); // Debug statement
                                        success = true; // Mark success if no exception is thrown

                                    } catch (Exception e) {
                                        System.out.println("Attempt " + (attempt + 1) + " failed: " + e.getMessage());
                                        attempt++;
                                        if (attempt < maxRetries) {
                                            System.out.println("Retrying...");
                                            Thread.sleep(1000); // Incremental wait time
                                        } else {
                                            System.out.println("Max retries reached. Skipping this department.");
                                            failedToClickAcc++;
                                        }
                                    }
                                }

                                // Re-fetch the page source after each wait
                                Document highSchoolsPage = Jsoup.parse(driver.getPageSource());
                                Elements highSchoolsElements = highSchoolsPage.select("div#icerik_1060 tbody tr");

                                if (highSchoolsElements.isEmpty()) {
                                    System.out.println("Error: No high school elements found.");
                                    noHSelements++; // Debug statement
                                } else {
                                    System.out.println("Found " + highSchoolsElements.size() + " high school elements.");
                                }

                                for (Element row : highSchoolsElements) {
                                    Element schoolElement = row.select("td.thb.small").first();
                                    Element countElement = row.select("td.text-center").first();

                                    if (schoolElement != null) {
                                        String schoolName = schoolElement.text().trim();
                                        System.out.println("Extracted school name: " + schoolName);

                                        if (!schoolName.equals("Toplam")) {
                                            int studentCount = Integer.parseInt(countElement.text().trim());
                                            SchoolCounts counts = highSchools.getOrDefault(
                                                    schoolName,
                                                    new SchoolCounts(0, 0)
                                            );

                                            // Increment total count
                                            counts.totalCount += studentCount;

                                            // Increment specific university count if applicable
                                            if (uniId.equals("2021")) {
                                                counts.specificUniCount += studentCount;
                                            }

                                            System.out.println("Adding school: " + schoolName +
                                                    " with total count: " + counts.totalCount +
                                                    " and specific uni count: " + counts.specificUniCount);

                                            highSchools.put(schoolName, counts);
                                        }
                                    } else {
                                        System.out.println("No school element found in row.");
                                    }
                                }
                            }
                        }

                        // End of processing that university
                        System.out.println("Current total unique schools: " + highSchools.size());
                    }
                }

                // Before writing to file
                System.out.println("Total schools to write: " + highSchools.size());

                // Use streams to sort and write the data
                highSchools.entrySet().stream()
                        .sorted(Map.Entry.comparingByKey())
                        .forEach(entry -> {
                            String fullSchoolName = entry.getKey();
                            SchoolCounts counts = entry.getValue();

                            // Initialize variables
                            String schoolName = "UNKNOWN";
                            String city = "UNKNOWN";
                            String district = "UNKNOWN";

                            try {
                                // Regex to match the last parenthesis group for city and district
                                Pattern pattern = Pattern.compile("\\(([^)]+)\\)$");
                                Matcher matcher = pattern.matcher(fullSchoolName);

                                if (matcher.find()) {
                                    String location = matcher.group(1).trim();
                                    String[] locationParts = location.split("-");
                                    if (locationParts.length == 2) {
                                        city = locationParts[0].trim();
                                        district = locationParts[1].trim();
                                    } else if (locationParts.length == 1) {
                                        if (!locationParts[0].trim().isEmpty()) {
                                            city = locationParts[0].trim();
                                        } else {
                                            district = locationParts[0].trim();
                                        }
                                    }
                                }

                                // Extract school name by removing the last parenthesis group
                                int lastOpenParen = fullSchoolName.lastIndexOf('(');
                                if (lastOpenParen != -1) {
                                    schoolName = fullSchoolName.substring(0, lastOpenParen).trim();
                                } else {
                                    schoolName = fullSchoolName.trim();
                                }

                            } catch (Exception e) {
                                System.err.println("Error processing school: " + fullSchoolName + " - " + e.getMessage());
                            } finally {
                                // Ensure the output line is written even if an error occurs
                                String outputLine = schoolName + "; " + city + "; " + district + "; " +
                                        counts.specificUniCount + "; " + counts.totalCount;
                                try {
                                    writer.write(outputLine + "\n");
                                } catch (IOException ioException) {
                                    System.err.println("Error writing to file: " + ioException.getMessage());
                                }
                            }
                        });

                System.out.println("All schools processed and written to file.");
                System.out.println("Accordion fails: " + failedToClickAcc);
                System.out.println("Overlay fails: " + overlayError);
                System.out.println("No Overlay: " + noOverlayCount);
                System.out.println("No HS elements: " + noHSelements);

                fullSuccess = true;

            } catch (IOException e) {
                e.printStackTrace();
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // WebDriver is closed
            if (driver != null) {
                driver.quit();
            }

            // 3) If everything was successful, remove old highschools.txt and rename
            //    highschools_not_ready.txt to highschools.txt
            if (fullSuccess) {
                File readyFile = new File("src/main/resources", "highschools.txt");
                // Delete existing highschools.txt if it exists
                if (readyFile.exists()) {
                    boolean deleted = readyFile.delete();
                    System.out.println("Deleted old highschools.txt: " + deleted);
                }
                // Rename highschools_not_ready.txt to highschools.txt
                File notReadyFile = new File("src/main/resources", "highschools_not_ready.txt");
                if (notReadyFile.exists()) {
                    boolean renamed = notReadyFile.renameTo(readyFile);
                    System.out.println("Renamed highschools_not_ready.txt -> highschools.txt: " + renamed);
                }

                // Debug message
                System.out.println("Processing complete and highschools.txt replaced successfully.");
            }
        }
    }
}
