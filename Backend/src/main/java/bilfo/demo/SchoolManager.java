package bilfo.demo;

import org.springframework.data.util.Pair;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;

@RestController
@RequestMapping("/school")
@CrossOrigin(origins = "*")

public class SchoolManager {
    private static Map<String, Map<String, Map<String, Pair<Integer, Integer>>>> schools;

    private static SchoolManager instance;

    private SchoolManager() {
        if (schools == null) {
            readSchoolFile("/highschools.txt");
        }
    }

    public static SchoolManager getInstance() {
        if (instance == null) {
            synchronized (SchoolManager.class) {
                if (instance == null) {
                    instance = new SchoolManager();
                }
            }
        }
        return instance;
    }

    @GetMapping("/cityNames")
    public String[] getCityNames()
    {
        if (schools == null) {
            readSchoolFile("/highschools.txt");
        }
        return schools.keySet().stream()
            .filter(city -> city != null && !city.trim().isEmpty())
            .toArray(String[]::new);
    }

    @GetMapping("/districtNames")
    public String[] getDistrictNames(@RequestParam String city)
    {
        return schools.containsKey(city) ? schools.get(city).keySet().toArray(new String[0]): new String[]{};
    }

    @GetMapping("/schoolNames")
    public String[] getSchoolNames(@RequestParam String city, @RequestParam String district)
    {
        return schools.containsKey(city) && schools.get(city).containsKey(district) ? schools.get(city).get(district).keySet().toArray(new String[0]): new String[]{};
    }

    public boolean schoolExists(String city, String district, String school)
    {
        return schools.containsKey(city) && schools.get(city).containsKey(district) && schools.get(city).get(district).containsKey(school);
    }

    public Pair<Integer, Integer> getAdmissionStatistics(String city, String district, String school)
    {
        try
        {
            return schools.get(city).get(district).get(school);
        }
        catch (Exception e)
        {
            return Pair.of(0, 1);
        }
    }

    public int getAdmissionsToBilkent(String city, String district, String school)
    {
        return getAdmissionStatistics(city, district, school).getFirst();
    }

    public int getBilkentToTotalAdmissionsPercentage(String city, String district, String school)
    {
        Pair<Integer, Integer> stat=getAdmissionStatistics(city, district, school);
        return (100 * stat.getFirst())/stat.getSecond();
    }

    public void readSchoolFile(String filePath) {
        if(schools!=null)
        {
            return;
        }
        Comparator<String> turkishComparator=new TurkishComparator();
        InputStream inputStream = getClass().getResourceAsStream(filePath);
        BufferedReader reader = null;
        schools = new TreeMap<>(turkishComparator);
        try
        {
            reader = new BufferedReader(new InputStreamReader(inputStream));
            String line;
            while ((line = reader.readLine()) != null)
            {
                if (line.contains("UNKNOWN")) {
                    continue;
                }
                
                String[] tokens = line.split(";");
                String schoolName = tokens[0].trim();
                String city = tokens[1].trim();
                String district = tokens[2].trim();
                int admissionsToBilkent = Integer.parseInt(tokens[3].trim());
                int admissionsTotal = Integer.parseInt(tokens[4].trim());

                if(!schools.containsKey(city))
                {
                    schools.put(city, new TreeMap<>(turkishComparator));
                }
                if(!schools.get(city).containsKey(district))
                {
                    schools.get(city).put(district, new TreeMap<>(turkishComparator));
                }
                schools.get(city).get(district).put(schoolName, Pair.of(admissionsToBilkent,admissionsTotal));
            }
        }
        catch (IOException e)
        {
            System.err.println("Error reading the file: " + e.getMessage());
        }
        finally
        {
            try
            {
                if (reader != null)
                {
                    reader.close();
                }
            }
            catch (IOException e)
            {
                System.err.println("Error closing the file reader: " + e.getMessage());
            }
        }
    }


    /**
     * A custom comparator class because java.text.Collator class was slow.
     * Should only be used with the following characters: " .-()0123456789AÂBCÇDEFGĞHIÎİJKLMNOÖPQRSŞTUÜVWXYZ"
     */
    private static class TurkishComparator implements Comparator<String> {

        public static final String comprehensiveAlphabet = " .-()0123456789AÂBCÇDEFGĞHIÎİJKLMNOÖPQRSŞTUÜVWXYZ";
        @Override
        public int compare(String o1, String o2) {
            if(o1==null)
            {
                return o2==null ? 0: -1;
            }
            int len = Math.min(o1.length(), o2.length());
            for (int i = 0; i < len; i++) {
                int index1 = comprehensiveAlphabet.indexOf(o1.charAt(i));
                int index2 = comprehensiveAlphabet.indexOf(o2.charAt(i));
                if (index1 != index2) return index1 - index2;
            }
            return o1.length() - o2.length();
        }
    }
}
