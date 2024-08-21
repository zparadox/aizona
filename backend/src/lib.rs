// Export the main modules
pub mod api;
pub mod models;
pub mod services;
pub mod utils;

// Re-export important structs and functions for easier access
pub use api::config as api_config;
pub use models::{agent::Agent, user::User};
pub use services::{agent_builder::AgentBuilder, token_manager::TokenManager};

// Any additional library-wide configuration or setup can go here
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}