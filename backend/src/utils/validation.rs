use regex::Regex;

pub fn is_valid_email(email: &str) -> bool {
    let email_regex = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();
    email_regex.is_match(email)
}

pub fn is_strong_password(password: &str) -> bool {
    let length_check = password.len() >= 8;
    let uppercase_check = password.chars().any(|c| c.is_uppercase());
    let lowercase_check = password.chars().any(|c| c.is_lowercase());
    let digit_check = password.chars().any(|c| c.is_digit(10));
    let special_char_check = password.chars().any(|c| !c.is_alphanumeric());

    length_check && uppercase_check && lowercase_check && digit_check && special_char_check
}

pub fn sanitize_input(input: &str) -> String {
    input.trim().replace(['<', '>', '&', '"', '\''], "")
}
