use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: Option<String>,
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub created_at: Option<chrono::DateTime<chrono::Utc>>,
    pub updated_at: Option<chrono::DateTime<chrono::Utc>>,
}

impl User {
    pub fn new(username: String, email: String, password_hash: String) -> Self {
        User {
            id: None,
            username,
            email,
            password_hash,
            created_at: None,
            updated_at: None,
        }
    }
}
