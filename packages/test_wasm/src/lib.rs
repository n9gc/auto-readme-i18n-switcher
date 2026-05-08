use wasm_bindgen::prelude::*;

#[wasm_bindgen]
/// ## 斐波那契数列
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn fibonacci_test() {
        assert_eq!(fibonacci(0), 0);
        assert_eq!(fibonacci(1), 1);
        assert_eq!(fibonacci(2), 1);
        assert_eq!(fibonacci(3), 2);
        assert_eq!(fibonacci(35), 9227465);
    }
}
