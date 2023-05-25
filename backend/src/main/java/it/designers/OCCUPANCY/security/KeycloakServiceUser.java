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
                .header("Authorization", "Basic b2NjdXBhbmN5Y2xpZW50OmVNTGJid25VU052d2NlYkF0TThCc2ZvOU8xcmpjMEZh")
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

    // Get username
    public String get_user_name(String token, String userID) throws UnirestException, JsonProcessingException {
        Unirest.setTimeouts(0, 0);
        HttpResponse<com.mashape.unirest.http.JsonNode> response = Unirest.get("http://localhost:8069/admin/realms/OCCUPANCY/users/"+userID)
                .header("Authorization", "Bearer "+token)
                .asJson();
        ObjectMapper mapper = new JsonMapper();
        JsonNode json = mapper.readTree(response.getBody().toString());
        
        String userName = json.get("username").asText();
        return userName;
    }
    
    // Get User Info
    public String get_user_info(String token, String userID) throws UnirestException, JsonProcessingException {
        Unirest.setTimeouts(0, 0);
        HttpResponse<com.mashape.unirest.http.JsonNode> response = Unirest.get("http://localhost:8069/admin/realms/OCCUPANCY/users/"+userID)
                .header("Authorization", "Bearer "+token)
                .asJson();
        return response.getBody().toString();
    }
    // public List<UUID> getGruppenMitglieder -> funktion (gruppenid) gibt liste an mitglieder-userids zurück
    // Get User Groups
    public String get_user_groups(String token, String userID) throws UnirestException, JsonProcessingException {
        Unirest.setTimeouts(0, 0);
        HttpResponse<com.mashape.unirest.http.JsonNode> response = Unirest.get("http://localhost:8069/admin/realms/OCCUPANCY/users/"+userID+"/groups")
                .header("Authorization", "Bearer "+token)
                .asJson();
        return response.getBody().toString();
    }
    // funktion: wenn rolle teamleiter oder projektleiter gibt gruppenid der eigenen gruppe zurück
    // etc ;)
}
