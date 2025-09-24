/*
use poem::{
    handler, listener::TcpListener, middleware::Tracing, post, web::Json, EndpointExt, Route,
    Server,
};
*/

use serde::Deserialize;

use std::{path::Path, sync::Arc};

use swc::ecmascript::ast::EsVersion;
use swc::{self, config::Options};
use swc_common::{
    comments::SingleThreadedComments,
    errors::{ColorConfig, Handler},
    Globals, Mark, SourceMap, GLOBALS,
};
use swc_ecma_transforms_react::{react, Options as ReactOptions};
use swc_ecmascript::parser::{EsConfig, Syntax};

/*
#[derive(Debug, Deserialize)]
struct SourceCode {
    hello: String,
}

#[handler]
fn compile(req: Json<SourceCode>) -> String {
    format!("hello: {}", req.hello)
}
*/

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
        .load_file(Path::new("index.js"))
        .expect("Failed to load JS file");

    let parse_result = c.parse_js(
        fm,
        &handler,
        EsVersion::Es2015,
        Syntax::Es(EsConfig {
            jsx: true,
            ..Default::default()
        }),
        swc::config::IsModule::Bool(true),
        None,
    );

    if let Ok(program) = parse_result {
        let comments = SingleThreadedComments::default();
        let globals = Globals::default();

        GLOBALS.set(&globals, || {
            let top_level_mark = Mark::fresh(Mark::root());

            // applies the react transformer, a port of @babel/preset-react
            let program = c.transform(
                &handler,
                program,
                false,
                react(
                    cm.clone(),
                    Some(&comments),
                    ReactOptions {
                        ..Default::default()
                    },
                    top_level_mark,
                ),
            );

            // generates the JS code
            let output = c
                .process_js(
                    &handler,
                    program,
                    &Options {
                        is_module: swc::config::IsModule::Bool(true),
                        ..Default::default()
                    },
                )
                .expect("failed to process file");
            print!("{}", output.code);
        });
    }
}
