import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "dev.harshh.portfolio"
    compileSdk = 36

    defaultConfig {
        applicationId = "dev.harshh.portfolio"
        // Floor is set by the Glyph AAR, whose own manifest declares minSdk 33 —
        // the manifest merger rejects anything lower. Android 13+ still covers
        // effectively every current device, and GlyphController guards at
        // runtime so the APK runs fine on non-Nothing hardware.
        minSdk = 33
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
                val p = Properties().apply { props.inputStream().use { load(it) } }
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
            "Missing Glyph SDK. glyph-matrix-sdk-2.0.aar is vendored in " +
                "android/app/libs/ — restore it from " +
                "https://github.com/Nothing-Developer-Programme/Glyph-Developer-Kit " +
                "(sdk/glyph-matrix-sdk-2.0.aar). See android/app/libs/README.md."
        )
    }
}
