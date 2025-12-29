package smartpay.Controller;


import org.springframework.web.bind.annotation.*;
import smartpay.Model.TutionPayment;
import smartpay.TutionService.TutionPaymentService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/tution-payments")
public class TutorPaymentController {

    private final TutionPaymentService tutionPaymentService;

    @Autowired
    public TutorPaymentController(TutionPaymentService tutionPaymentService){
        this.tutionPaymentService=tutionPaymentService;
    }

    @PostMapping
    public TutionPayment createTutionPayment(@RequestBody TutionPayment tutionPayment){
        return tutionPaymentService.createTutionPayment(tutionPayment);
    }
    @GetMapping
    public List<TutionPayment> getAllTutionPaymentDetails(){
        return tutionPaymentService.getAllTutionPaymentDetails();
    }
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable String id){
        tutionPaymentService.deleteByID(id);
    }


}
