package smartpay.TutionService;


import smartpay.Model.TutionPayment;
import smartpay.TutionRepository.TutionPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TutionPaymentService {


    private TutionPaymentRepository tutionPaymentRepository;

    @Autowired
    public TutionPaymentService(TutionPaymentRepository tutionPaymentRepository){
        this.tutionPaymentRepository=tutionPaymentRepository;
    }

    public TutionPayment createTutionPayment( TutionPayment tutionPayment){
         return tutionPaymentRepository.save(tutionPayment);
    }
    public List<TutionPayment> getAllTutionPaymentDetails(){
        return tutionPaymentRepository.findAll();
    }
    public void deleteByID(String tutionPaymentId){
        tutionPaymentRepository.deleteById(tutionPaymentId);
    }

}
