package com.tokosaya.kasir;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Camera Permission Handler Plugin for Kasir POS
 * Handles camera permissions for QR code scanning and barcode reading
 */
@CapacitorPlugin(name = "CameraPermissionHandler")
public class CameraPermissionHandler extends Plugin {

    private static final int CAMERA_PERMISSION_REQUEST = 101;
    private PluginCall savedCall;

    @PluginMethod
    public void requestCameraPermission(PluginCall call) {
        if (isCameraPermissionGranted()) {
            // Permission already granted
            JSObject result = new JSObject();
            result.put("granted", true);
            result.put("message", "Izin kamera sudah diberikan");
            call.resolve(result);
            return;
        }

        // Request permission
        savedCall = call;
        ActivityCompat.requestPermissions(
            getActivity(),
            new String[]{Manifest.permission.CAMERA},
            CAMERA_PERMISSION_REQUEST
        );
    }

    @PluginMethod
    public void checkCameraPermission(PluginCall call) {
        JSObject result = new JSObject();
        result.put("granted", isCameraPermissionGranted());
        result.put("message", isCameraPermissionGranted() ? 
            "Izin kamera diberikan" : "Izin kamera belum diberikan");
        call.resolve(result);
    }

    private boolean isCameraPermissionGranted() {
        return ContextCompat.checkSelfPermission(
            getContext(),
            Manifest.permission.CAMERA
        ) == PackageManager.PERMISSION_GRANTED;
    }

    @Override
    protected void handleRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.handleRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == CAMERA_PERMISSION_REQUEST && savedCall != null) {
            JSObject result = new JSObject();

            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                result.put("granted", true);
                result.put("message", "Izin kamera diberikan");
                savedCall.resolve(result);
            } else {
                result.put("granted", false);
                result.put("message", "Izin kamera ditolak pengguna");
                savedCall.reject("Camera permission denied", result);
            }

            savedCall = null;
        }
    }
}
