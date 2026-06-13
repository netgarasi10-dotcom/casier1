package com.tokosaya.kasir;

import android.Manifest;
import android.os.Build;
import androidx.core.app.ActivityCompat;
import com.getcapacitor.BridgeActivity;

/**
 * Main Activity for Kasir POS Application
 * Handles initial setup and permission requests for Android
 */
public class MainActivity extends BridgeActivity {
    
    @Override
    protected void onCreate(android.os.Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Request camera permissions on app startup for Android 6.0+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.CAMERA) 
                != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                    this,
                    new String[]{Manifest.permission.CAMERA},
                    100
                );
            }
        }
    }
}
