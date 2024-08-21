use actix_web::{App, HttpServer};
use dotenv::dotenv;
use std::env;

mod api;
mod models;
mod services;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init();

    let host = env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());

    println!("Server running at http://{}:{}", host, port);

    HttpServer::new(|| {
        App::new()
            .configure(api::config)
    })
    .bind(format!("{}:{}", host, port))?
    .run()
    .await
}
