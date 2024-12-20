package bilfo.demo;

import org.springframework.data.util.Pair;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;

@RequestMapping("/form")
public class SchoolManager {
    private static Map<String, Map<String, Map<String, Pair<Integer, Integer>>>> schools;

    private static SchoolManager instance;

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
        return schools.keySet().toArray(new String[0]);
    }

    @GetMapping("/districtNames")
    public String[] getDistrictNames(@RequestParam String city)
    {
        return schools.get(city).keySet().toArray(new String[0]);
    }

    @GetMapping("/schoolNames")
    public String[] getSchoolNames(@RequestParam String city, @RequestParam String district)
    {
        return schools.get(city).get(district).keySet().toArray(new String[0]);
    }

    public Pair<Integer, Integer> getAdmissionStatistics(String city, String district, String school)
    {
        return schools.get(city).get(district).get(school);
    }

    public void readSchoolFile(String filePath) {
        if(schools!=null)
        {
            return;
        }
        InputStream inputStream = getClass().getResourceAsStream(filePath);
        BufferedReader reader = null;
        schools = new TreeMap<>();
        try
        {
            reader = new BufferedReader(new InputStreamReader(inputStream));
            String line;
            while ((line = reader.readLine()) != null)
            {
                String[] tokens = line.split(";");
                String schoolName = tokens[0].trim();
                String city = tokens[1].trim();
                String district = tokens[2].trim();
                int admissionsToBilkent = Integer.parseInt(tokens[3].trim());
                int admissionsTotal = Integer.parseInt(tokens[4].trim());

                if(!schools.containsKey(city))
                {
                    schools.put(city, new TreeMap<>());
                }
                if(!schools.get(city).containsKey(district))
                {
                    schools.get(city).put(district, new TreeMap<>());
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

}
