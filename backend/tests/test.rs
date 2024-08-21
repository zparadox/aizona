use backend::utils::validation::{is_valid_email, is_strong_password, sanitize_input};

#[test]
fn test_is_valid_email() {
    assert!(is_valid_email("user@example.com"));
    assert!(is_valid_email("user.name+tag@example.co.uk"));
    assert!(!is_valid_email("invalid-email"));
    assert!(!is_valid_email("@example.com"));
    assert!(!is_valid_email("user@.com"));
}

#[test]
fn test_is_strong_password() {
    assert!(is_strong_password("StrongP@ss1"));
    assert!(is_strong_password("C0mpl3x!P@ssw0rd"));
    assert!(!is_strong_password("weakpass"));
    assert!(!is_strong_password("NoDigits!"));
    assert!(!is_strong_password("no-uppercase-1"));
}

#[test]
fn test_sanitize_input() {
    assert_eq!(sanitize_input("  Hello, World!  "), "Hello, World!");
    assert_eq!(sanitize_input("<script>alert('XSS')</script>"), "scriptalert('XSS')/script");
    assert_eq!(sanitize_input("John's \"quote\""), "Johns quote");
}