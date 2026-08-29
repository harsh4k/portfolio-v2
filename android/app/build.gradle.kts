plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "dev.harshh.portfolio"
    compileSdk = 36

    defaultConfig {
        applicationId = "dev.harshh.portfolio"
        // TileService needs 24; the Glyph SDK needs 34 and is guarded at runtime
        // so this APK still installs and runs on older, non-Nothing devices.
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }

    signingConfigs {
        create("release") {
            // Populated from android/keystore.properties — see docs/NOTHING-4B.md.
            // Left unconfigured here so the file carries no secrets.
            val props = rootProject.file("keystore.properties")
            if (props.exists()) {
                val p = java.util.Properties().apply { props.inputStream().use { load(it) } }
                storeFile = rootProject.file(p.getProperty("storeFile"))
                storePassword = p.getProperty("storePassword")
                keyAlias = p.getProperty("keyAlias")
                keyPassword = p.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            if (rootProject.file("keystore.properties").exists()) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}

dependencies {
    // Trusted Web Activity host. Renders the live PWA in Chrome with no
    // browser UI, provided Digital Asset Links verification passes.
    implementation("com.google.androidbrowserhelper:androidbrowserhelper:2.7.3")

    // Nothing Glyph Developer Kit. The AAR is NOT vendored — download it into
    // android/app/libs/ before building. See android/app/libs/README.md.
    implementation(fileTree(mapOf("dir" to "libs", "include" to listOf("*.aar"))))
}

// Fail early and legibly rather than with an unresolved-symbol wall.
gradle.taskGraph.whenReady {
    val libs = file("libs").listFiles { f -> f.extension == "aar" }
    if (libs.isNullOrEmpty()) {
        throw GradleException(
            "Missing Glyph SDK. Download the .aar from " +
                "https://github.com/Nothing-Developer-Programme/Glyph-Developer-Kit " +
                "into android/app/libs/ — see android/app/libs/README.md."
        )
    }
}
