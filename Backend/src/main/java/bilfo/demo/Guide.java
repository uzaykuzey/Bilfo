package bilfo.demo;


import org.bson.types.ObjectId;

public class Guide extends User{
    public Guide(ObjectId id,int bilkentID, USER_STATUS status, String username, String email, String password, DEPARTMENT department) {
        super(id, bilkentID, status, username, email, password, department);
    }


}
