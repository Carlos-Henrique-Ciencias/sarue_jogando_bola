mod models;
mod handlers;
mod routes;

use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use axum::Router;
use sqlx::postgres::PgPoolOptions;

#[tokio::main]
async fn main() {
    // Restaurada a sua conexão local direta e bruta do banco que funciona!
    let pool = PgPoolOptions::new()
        .max_connections(20)
        .connect("postgres://postgres:root@localhost:5432/govcore_erp")
        .await
        .unwrap();

    let cors = CorsLayer::permissive();

    // Tipagem explícita para matar o erro E0282
    let app: Router = routes::criar_rotas_erp()
        .layer(cors)
        .with_state(pool);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("📡 SISTEMA GOVCORE MODULARIZADO (24 Módulos) rodando em http://{}", addr);
    
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
