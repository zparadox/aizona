use crate::models::user::User;
use anyhow::Result;
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}

pub struct TokenManager {
    secret: String,
}

impl TokenManager {
    pub fn new(secret: String) -> Self {
        TokenManager { secret }
    }

    pub async fn authenticate(&self, username: &str, password: &str) -> Result<String> {
        // In a real application, you would verify the username and password against a database
        // For this example, we'll just create a token if the username and password are not empty
        if !username.is_empty() && !password.is_empty() {
            self.generate_token(username)
        } else {
            Err(anyhow::anyhow!("Invalid credentials"))
        }
    }

    pub async fn register_user(&self, user_data: User) -> Result<User> {
        // Implement user registration logic
        // This might involve saving to a database, validating data, etc.
        Ok(user_data)
    }

    fn generate_token(&self, username: &str) -> Result<String> {
        let expiration = SystemTime::now()
            .duration_since(UNIX_EPOCH)?
            .as_secs() + 3600; // Token valid for 1 hour

        let claims = Claims {
            sub: username.to_string(),
            exp: expiration as usize,
        };

        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.secret.as_bytes()),
        )?;

        Ok(token)
    }
}
