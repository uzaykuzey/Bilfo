package bilfo.demo.formCollection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/form")
public class FormManager {
    @Autowired
    private FormService formService;

    @GetMapping
    public ResponseEntity<List<Form>> allForms() {
        return new ResponseEntity<List<Form>>(formService.allForms(), HttpStatus.OK);
    }
}


