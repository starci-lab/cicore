import { ChainId, Network } from "@modules/common"
import { v4 } from "uuid"
import { join } from "path"
import ms from "ms"

export enum LpBotType {
    System = "system",       // bot self run, use own key
    UserBased = "user-based" // bot get user from DB to run
  }

export const envConfig = () => ({
    isProduction: process.env.NODE_ENV === "production",
    port: {
        core: process.env.CORE_PORT || 3010,
    },
    frontend: {
        url: process.env.FRONTEND_URL || "http://localhost:3000/callback/google",
    },
    coinMarketCap: {
        apiKey: process.env.COIN_MARKET_CAP_API_KEY || "",
    },
    totp: {
        logo: process.env.TOTP_LOGO || "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-1/534136898_749293854666581_1584213272352607870_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeFqh_r3g1VaKKx2wFccqASXzBUDs9FLWU_MFQOz0UtZT0Pflcmod5znN1RtZH6geE4rZxAs1W7G0U1ZjE0oRwUb&_nc_ohc=HZoHHQaSGX0Q7kNvwFfrVZq&_nc_oc=Adk2goBox0pzD9vSz44dUTtPLaDeFbqBwz4c5LW3gaIyi5a8zCQvMSsKPV_0n2FR_q0&_nc_zt=24&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=v9zPPrhoxGVDOHOHmPQtdw&oh=00_Afbr9TMLXtHZ_BxLmnjH1AVQeq3Q4QJCq5Wtsan6LC5tqg&oe=68DF1667",
        color: process.env.TOTP_COLOR || "#4267b2",
        backgroundColor: process.env.TOTP_BACKGROUND_COLOR || "#e9ebee",
    },
    sentry: {
        dsn: process.env.SENTRY_DSN || "https://4b08d10ac2853aaf7c60950ad2eb6114@o4510097305042944.ingest.de.sentry.io/4510097307074640",
        version: process.env.VERSION || "0.0.1",
    },
    redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379", 10),
        password: process.env.REDIS_PASSWORD || "Cuong123_A",
        ttl: parseInt(process.env.REDIS_TTL || "3600000", 10), // 3600s
    },
    cache: {
        memoryTtl: parseInt(process.env.CACHE_MEMORY_TTL || "3600000", 10), // 3600s
        redisTtl: parseInt(process.env.CACHE_REDIS_TTL || "3600000", 10), // 3600s
    },
    databases: {
        mongoose: {
            host: process.env.MONGOOSE_HOST || "localhost",
            port: parseInt(process.env.MONGOOSE_PORT || "27018", 10),
            password: process.env.MONGOOSE_PASSWORD || "Cuong123_A",
            username: process.env.MONGOOSE_USERNAME || "root",
            dbName: process.env.MONGOOSE_DB_NAME || "cicore",
        },
    },
    volume: {
        data: {
            path: process.env.VOLUME_DATA_PATH || join(process.cwd(), ".db"),
        },
    },
    deepseek: {
        apiKey: process.env.DEEPSEEK_API_KEY || "",
        apiUrl: process.env.DEEPSEEK_API_URL || "https://api.deepseek.ai/v1/analyze",
    },
    debug: {
        kaminoVaultFetch: Boolean(process.env.KAMINO_VAULT_FETCH_DEBUG) || true,
    },
    cryptography: {
        sha256Salt: process.env.SHA256_SALT || "ciswipesha256",
        aesCbcKey: process.env.AES_CBC_KEY || "6E99BDF4DA700D7F002B6185985CEA9C",
    },
    loki: {
        host: process.env.LOKI_HOST || "http://localhost:3100",
        requireAuth: Boolean(process.env.LOKI_REQUIRE_AUTH) || false,
        username: process.env.LOKI_USERNAME,
        password: process.env.LOKI_PASSWORD,
    },
    crypto: {
        cipher: {
            secret: process.env.CIPHER_SECRET || "Cuong123_A",
        },
        bcrypt: {
            salt: process.env.BCRYPT_SALT || "Cuong123_A",
        },
    },
    googleCloud: {
        oauth: {
            clientId: process.env.GOOGLE_CLOUD_OAUTH_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLOUD_OAUTH_CLIENT_SECRET || "",
            redirectUri: process.env.GOOGLE_CLOUD_OAUTH_REDIRECT_URI || "",
        },
        kms: {
            keyName: process.env.GOOGLE_CLOUD_KMS_KEY_NAME || "",
        },
        secret: {
            secretName: process.env.GOOGLE_CLOUD_SECRET_NAME || "",
        },
    },
    jwt: {
        accessToken: {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET || "Cuong123_A",
            expiration: (process.env.JWT_ACCESS_TOKEN_EXPIRATION || "1h") as ms.StringValue,
        },
        refreshToken: {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET || "Cuong123_A",
            expiration: (process.env.JWT_REFRESH_TOKEN_EXPIRATION || "7d") as ms.StringValue,
        },
    },
    rpcs: {
        [ChainId.Sui]: {
            [Network.Mainnet]: Array.from({ length: 10 }, (_, i) =>
                process.env[`SUI_RPC_URL_${i + 1}`] || ""
            ).filter((url) => url !== ""),
            [Network.Testnet]: Array.from({ length: 10 }, (_, i) =>
                process.env[`SUI_RPC_URL_${i + 1}_TESTNET`] || ""
            ).filter((url) => url !== ""),
        },
        [ChainId.Solana]: {
            [Network.Mainnet]: Array.from({ length: 10 }, (_, i) =>
                process.env[`SOLANA_RPC_URL_${i + 1}`] || ""
            ).filter((url) => url !== ""),
            [Network.Testnet]: Array.from({ length: 10 }, (_, i) =>
                process.env[`SOLANA_RPC_URL_${i + 1}_TESTNET`] || ""
            ).filter((url) => url !== ""),
        },
    },
    lpBot: {
        // Determine bot type:
        // - System: a local NestJS bot running without external connections.  
        //   It charges a fixed fee of (1% ROI) for each processed transaction.  
        // - User-based: a cloud-enabled bot that fetches user info from the DB,  
        //   used when users want to run their own bots on the cloud.
        type: process.env.LP_BOT_TYPE || LpBotType.System,
        // Env for system bot
        // we use userId to identify the user
        userId: process.env.LP_BOT_USER_ID,
        exitToUsdc: Boolean(process.env.LP_BOT_EXIT_TO_USDC) || false,
        priorityToken: process.env.LP_BOT_PRIORITY_TOKEN,
        // Env for user-based bot
        // we use instanceId to identify the instance
        instanceId: process.env.LP_BOT_INSTANCE_ID,
        appName: process.env.APP_NAME || "lp-bot",
        enablePriceFetcher: Boolean(process.env.ENABLE_PRICE_FETCHER) || true,
        suiWallet: {
            accountAddress: process.env.LP_BOT_WALLET_ACCOUNT_ADDRESS || "",
            encryptedPrivateKey: process.env.LP_BOT_SUI_WALLET_ENCRYPTED_PRIVATE_KEY || "",
        },
        evmWallet: {
            accountAddress: process.env.LP_BOT_EVM_WALLET_ACCOUNT_ADDRESS || "",
            encryptedPrivateKey: process.env.LP_BOT_EVM_WALLET_ENCRYPTED_PRIVATE_KEY || "",
        },
        solanaWallet: {
            accountAddress: process.env.LP_BOT_SOLANA_WALLET_ACCOUNT_ADDRESS || "",
            encryptedPrivateKey: process.env.LP_BOT_SOLANA_WALLET_ENCRYPTED_PRIVATE_KEY || "",
        },
    },
    kafka: {
        clientId: process.env.KAFKA_CLIENT_ID || v4(),
        host: process.env.KAFKA_BROKER_HOST || "localhost",
        port: parseInt(process.env.KAFKA_BROKER_PORT || "9092", 10),
        sasl: {
            enabled: Boolean(process.env.KAFKA_SASL_ENABLED) || false,
            username: process.env.KAFKA_SASL_USERNAME || "",
            password: process.env.KAFKA_SASL_PASSWORD || "",
        },
    },
    pyth: {
        sui: {
            endpoint: process.env.SUI_PYTH_ENDPOINT || "https://hermes.pyth.network",
        },
        solana: {
            endpoint: process.env.SOLANA_PYTH_ENDPOINT || "https://hermes-beta.pyth.network",
        },
    }
})
