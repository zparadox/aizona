use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Agent {
    pub id: Option<String>,
    pub name: String,
    pub description: String,
    pub capabilities: Vec<String>,
    pub owner_id: String,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

impl Agent {
    pub fn new(name: String, description: String, capabilities: Vec<String>, owner_id: String) -> Self {
        Agent {
            id: None,
            name,
            description,
            capabilities,
            owner_id,
            created_at: None,
            updated_at: None,
        }
    }
}
