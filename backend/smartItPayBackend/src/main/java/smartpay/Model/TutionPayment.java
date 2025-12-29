package smartpay.Model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;

@Document(collection = "tution_payments")
@Getter
@Setter
@AllArgsConstructor
public class TutionPayment {

    @Id
    private String id;

    private Double totalDurationOfSessionTaken;

    private Double finalAmountToParent;

    private String parentPhoneNumber;

    private Double paymentToTutorPerHr;

    private Double paymentToParentPerHr;

    private Double toTutorBeforeRegistration;

    private Double registrationFee;

    private Double toTutorAfterRegistrationFee;

    private Double profit;


    @CreatedDate
    private Instant createdAt;

    private String tutionIdAndTutionName;

}
