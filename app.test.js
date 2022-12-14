import request from "supertest";
import app from "./app";

// import jest from "jest";

// jest.useFakeTimers()

describe("Auth Routes", () => {

    describe("Check User", () => {
        
        it("should return proper reponse when email provided", async () => {
        const response = await request(app).post("/auth/check-user").send({
            email: "richardjoel835@gmail.com"
        }).expect(200);
        return expect(response.body).toEqual({
            exists: expect.any(Boolean),
            message: expect.any(String)
        });
        })
        
        it("should return 400 when email not provided", async () => {
            const response = await request(app).post("/auth/check-user").expect(400);
        });
    })

    describe("Edit Profile", () => {
        it("should return 401 when no token provided", async () => {
            return request(app).get("/auth/profile")
                .expect(401)
        }
        )
            
        it("should return 200 when token provided", async () => {
            return request(app).get("/auth/profile")
                .set('Cookie', [`jwt=token; Path=/; HttpOnly`])
                .expect(200)
        })
    })
})