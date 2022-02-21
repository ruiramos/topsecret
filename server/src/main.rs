use poem::{
    handler, listener::TcpListener, middleware::Tracing, post, web::Json, EndpointExt, Route,
    Server,
};

use serde::Deserialize;

use std::{path::Path, sync::Arc};

use swc::{self, config::Options};
use swc_common::{
    errors::{ColorConfig, Handler},
    SourceMap,
};

#[derive(Debug, Deserialize)]
struct SourceCode {
    hello: String,
}

#[handler]
fn compile(req: Json<SourceCode>) -> String {
    format!("hello: {}", req.hello)
}

/*
#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "poem=debug");
    }

    tracing_subscriber::fmt::init();

    let app = Route::new().at("/", post(compile)).with(Tracing);
    Server::new(TcpListener::bind("127.0.0.1:4000"))
        .name("hello-world")
        .run(app)
        .await
}*/

fn main() {
    let cm = Arc::<SourceMap>::default();
    let handler = Arc::new(Handler::with_tty_emitter(
        ColorConfig::Auto,
        true,
        false,
        Some(cm.clone()),
    ));
    let c = swc::Compiler::new(cm.clone());

    let fm = cm
        .load_file(Path::new("foo.js"))
        .expect("failed to load file");

    let result = c
        .process_js_file(
            fm,
            &handler,
            &Options {
                ..Default::default()
            },
        )
        .expect("failed to process file");

    print!("{:?}", result);
}
