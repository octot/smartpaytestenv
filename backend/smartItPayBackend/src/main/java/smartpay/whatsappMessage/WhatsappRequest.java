package smartpay.whatsappMessage;


import org.springframework.stereotype.Service;

@Service
public class WhatsappRequest {

    private String message;

    public String getMessage(){
        return message;
    }


}
