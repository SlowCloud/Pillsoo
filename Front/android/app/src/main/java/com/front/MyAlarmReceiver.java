import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

public class MyAlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        // 알람이 울릴 때의 동작 (예: Toast 메시지)
        Toast.makeText(context, "알람이 울렸습니다!", Toast.LENGTH_SHORT).show();
    }
}
