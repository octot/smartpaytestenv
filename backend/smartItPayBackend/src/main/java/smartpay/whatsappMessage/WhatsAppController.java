package smartpay.whatsappMessage;


import com.twilio.rest.api.v2010.account.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
public class WhatsAppController {

    @Value("${twilio.from-number}")
    private String fromNumber;

    @Value("${twilio.to-number}")
    private String toNumber;

    @GetMapping("/")
    public String healthCheck() {
        return "Hello from WhatsApp server!";
    }

    @PostMapping("/send-whatsapp")
    public ResponseEntity<?> sendWhatsApp(@RequestBody WhatsappRequest request) {

        try {
            Message message = Message.creator(
                    new com.twilio.type.PhoneNumber(toNumber),
                    new com.twilio.type.PhoneNumber(fromNumber),
                    request.getMessage()
            ).create();

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message", "Message sent with SID: " + message.getSid()
                    )
            );

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of(
                            "success", false,
                            "message", "Error sending message: " + e.getMessage()
                    )
            );
        }

}
}
