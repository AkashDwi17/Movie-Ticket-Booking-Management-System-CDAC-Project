# 🔐 Auth Service — Spring Boot Microservice with JWT, OAuth2, and Eureka

## 📘 Overview
The **Auth Service** is a Spring Boot microservice that handles **user authentication and authorization** using **JWT (JSON Web Tokens)**.  
It allows users to **sign up**, **log in**, and **access secured APIs** using a stateless JWT mechanism.  
The service registers itself with **Eureka Server** for service discovery and uses **Spring Security + OAuth2 Resource Server** for validation.

---

## 🧠 Features
✅ User Registration (Signup)  
✅ User Login (JWT Generation)  
✅ Role-based Access Control (`USER`, `ADMIN`, `SUPER_ADMIN`)  
✅ Password encryption with BCrypt  
✅ JWT validation using OAuth2 Resource Server  
✅ Swagger UI for API documentation  
✅ Integration with Eureka Service Registry  
✅ MySQL database integration

---

## ⚙️ Tech Stack

| Component | Technology |
|------------|-------------|
| Framework | Spring Boot 3.5.7 |
| Security | Spring Security, OAuth2 Resource Server |
| JWT | JJWT (io.jsonwebtoken 0.13.0) |
| Database | MySQL 8.x |
| ORM | Spring Data JPA (Hibernate) |
| Service Discovery | Netflix Eureka |
| Documentation | Swagger (Springdoc OpenAPI 2.5.0) |
| Build Tool | Maven |
| Language | Java 


“We’re using the JWT validation part of OAuth2, but not the login/consent part.”

