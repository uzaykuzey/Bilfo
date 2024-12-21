package bilfo.demo.security.dto;

import bilfo.demo.enums.USER_STATUS;
import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private int bilkentId;
    private USER_STATUS status;
    private String username;

    public LoginResponse(String token, int bilkentId, USER_STATUS status, String username) {
        this.token = token;
        this.bilkentId = bilkentId;
        this.status = status;
        this.username = username;
    }
}
