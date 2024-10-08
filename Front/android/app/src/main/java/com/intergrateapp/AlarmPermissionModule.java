import android.app.AlarmManager;
import android.content.Context;
import android.os.Build;
import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class AlarmPermissionModule extends ReactContextBaseJavaModule {

    public AlarmPermissionModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AlarmPermissionModule";
    }
    // 알람을 묻습니다.
    @ReactMethod
    public void canScheduleExactAlarms(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            AlarmManager alarmManager = (AlarmManager) getReactApplicationContext().getSystemService(Context.ALARM_SERVICE);
            promise.resolve(alarmManager.canScheduleExactAlarms());
        } else {
            promise.resolve(true); // Older versions don't require this permission
        }
    }
     // 설정창으로 이동합니다.
    @ReactMethod
    public void openAlarmSettings() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
            intent.setData(Uri.parse("package:com.hackers.HackersOne"));
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            if (intent.resolveActivity(getReactApplicationContext().getPackageManager()) != null) {
                getReactApplicationContext().startActivity(intent);
            }
        }
    }
}