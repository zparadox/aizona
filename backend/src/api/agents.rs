use actix_web::{web, HttpResponse, Responder};
use crate::models::agent::Agent;
use crate::services::agent_builder::AgentBuilder;

pub async fn create_agent(agent_builder: web::Data<AgentBuilder>, agent_data: web::Json<Agent>) -> impl Responder {
    match agent_builder.create_agent(agent_data.into_inner()).await {
        Ok(agent) => HttpResponse::Ok().json(agent),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn get_agent(agent_builder: web::Data<AgentBuilder>, agent_id: web::Path<String>) -> impl Responder {
    match agent_builder.get_agent(&agent_id).await {
        Ok(Some(agent)) => HttpResponse::Ok().json(agent),
        Ok(None) => HttpResponse::NotFound().body("Agent not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn list_agents(agent_builder: web::Data<AgentBuilder>) -> impl Responder {
    match agent_builder.list_agents().await {
        Ok(agents) => HttpResponse::Ok().json(agents),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/agents")
            .route("", web::post().to(create_agent))
            .route("", web::get().to(list_agents))
            .route("/{agent_id}", web::get().to(get_agent))
    );
}
