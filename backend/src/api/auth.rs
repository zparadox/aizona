use actix_web::{web, HttpResponse, Responder};
use crate::models::user::User;
use crate::services::token_manager::TokenManager;

pub async fn login(token_manager: web::Data<TokenManager>, credentials: web::Json<User>) -> impl Responder {
    match token_manager.authenticate(&credentials.username, &credentials.password).await {
        Ok(token) => HttpResponse::Ok().json(token),
        Err(_) => HttpResponse::Unauthorized().body("Invalid credentials"),
    }
}

pub async fn register(token_manager: web::Data<TokenManager>, user_data: web::Json<User>) -> impl Responder {
    match token_manager.register_user(user_data.into_inner()).await {
        Ok(user) => HttpResponse::Created().json(user),
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/auth")
            .route("/login", web::post().to(login))
            .route("/register", web::post().to(register))
    );
}
