mod agents;
mod auth;

use actix_web::web;

pub fn config(cfg: &mut web::ServiceConfig) {
    agents::config(cfg);
    auth::config(cfg);
}