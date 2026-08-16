// Prevents an additional console window on Windows in release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{WebviewUrl, WebviewWindowBuilder};

/// The web app this shell loads. Override at build time, e.g.
/// `NOMADFM_WEB_URL=https://example.com/app pnpm tauri build`.
/// The app needs internet anyway, and this doubles as an auto-update
/// mechanism: deploying the web app updates every installed desktop shell.
const WEB_URL: &str = match option_env!("NOMADFM_WEB_URL") {
    Some(url) => url,
    None => "https://indiwidee.github.io/nomadfm/app/",
};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            WebviewWindowBuilder::new(app, "main", WebviewUrl::External(WEB_URL.parse()?))
                .title("Nomad FM")
                .inner_size(1200.0, 800.0)
                .min_inner_size(900.0, 600.0)
                .center()
                .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
