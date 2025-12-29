package smartpay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;


@EnableMongoAuditing
@SpringBootApplication
public class TutionPaymentMain {

    public static void main(String[] args){
      SpringApplication.run(TutionPaymentMain.class,args);
    }


}
