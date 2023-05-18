package it.designers.OCCUPANCY.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import org.springframework.stereotype.Component;

@Component
public class KeycloakServiceUser {
    public String get_access_token() throws UnirestException, JsonProcessingException {
        Unirest.setTimeouts(0, 0);
        HttpResponse<String> response = Unirest.post("http://localhost:8069/realms/OCCUPANCY/protocol/openid-connect/token")
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("Authorization", "Basic b2NjdXBhbmN5Y2xpZW50Ok50N05XTTNOTWFOSndZV2xMS053bkh4T1pIMUhWTDY2")
                .field("grant_type", "client_credentials")
                .asString();
        ObjectMapper mapper = new JsonMapper();
        JsonNode json = mapper.readTree(response.getBody().toString());

        String access_token = json.get("access_token").asText();
        return access_token;
    }
    // Get Group Members
    public String get_group_members(String token, String groupID) throws UnirestException, JsonProcessingException {
        Unirest.setTimeouts(0, 0);
        HttpResponse<com.mashape.unirest.http.JsonNode> response = Unirest.get("http://localhost:8069/admin/realms/OCCUPANCY/groups/"+groupID+"/members")
                .header("Authorization", "Bearer "+token)
                .asJson();
        return response.getBody().toString();
    }

}
