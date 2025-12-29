package smartpay.TutionRepository;

import smartpay.Model.TutionPayment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TutionPaymentRepository extends MongoRepository<TutionPayment,String> {

}
