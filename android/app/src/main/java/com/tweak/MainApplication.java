package com.tweak;

import android.app.Application;

import com.facebook.react.ReactApplication;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.wenkesj.voice.VoicePackage;
import net.no_mad.tts.TextToSpeechPackage;
import com.reactlibrary.RNBluemixPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.pgsqlite.SQLitePluginPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new VectorIconsPackage(),
          new SQLitePluginPackage(),
          new MainReactPackage(),
            new RNGoogleSigninPackage(),
            new SplashScreenReactPackage(),
            new VoicePackage(),
          new TextToSpeechPackage(),
          new RNBluemixPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
