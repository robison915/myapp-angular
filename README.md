# Ionic Angular (WSL + Android Studio no Windows)

Este guia cobre os comandos para:
- criar o projeto Ionic Angular
- iniciar em dev (hot reload) na web
- iniciar em dev (hot reload) com Ionic CLI
- instalar e rodar no emulador Android

## 1) Criar o projeto

```bash
# (se ainda nao tiver o Ionic CLI)
npm install -g @ionic/cli

# criar projeto
ionic start meu-app tabs --type angular

# entrar na pasta do projeto
cd meu-app

# instalar dependencias (normalmente o ionic start ja faz isso)
npm install
```

## 2) Rodar em dev na web (hot reload)

```bash
ionic serve
```

Para expor na rede/local customizado:

```bash
ionic serve --host 0.0.0.0 --port 8100
```

Alternativa Angular com HMR:

```bash
ng serve --hmr
```

## 3) Iniciar pelo Ionic CLI (dev)

```bash
ionic serve --livereload
```

## 4) Preparar Android (Capacitor)

```bash
# dentro do projeto
ionic build
ionic cap add android
ionic cap sync android
```

> Se a pasta `android/` ja existir, rode apenas `ionic cap sync android`.

## 5) Emulador Android com Android Studio no Windows (via WSL)

### 5.1 Definir caminho do SDK (ajuste o usuario)

```bash
export ANDROID_SDK_ROOT="/mnt/c/Users/SEU_USUARIO/AppData/Local/Android/Sdk"
```

### 5.2 Listar emuladores (AVDs)

```bash
"$ANDROID_SDK_ROOT/emulator/emulator.exe" -list-avds
```

### 5.3 Iniciar o emulador

```bash
"$ANDROID_SDK_ROOT/emulator/emulator.exe" -avd NOME_DO_AVD
```

Exemplo:

```bash
"$ANDROID_SDK_ROOT/emulator/emulator.exe" -avd Pixel_7_API_35
```

### 5.4 Confirmar dispositivo via ADB

```bash
"$ANDROID_SDK_ROOT/platform-tools/adb.exe" devices
```

Quando aparecer `device`, o emulador esta pronto.

## 6) Instalar e rodar o app no emulador

### Opcao A (recomendada no WSL, sem hot reload)

```bash
cd /mnt/c/dev/meu-app
ionic build
npx cap sync android
cd android
cmd.exe /C "set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr&& set PATH=%JAVA_HOME%\bin;%PATH%&& gradlew.bat installDebug"
cd ..
"/mnt/c/Users/rb/AppData/Local/Android/Sdk/platform-tools/adb.exe" shell monkey -p io.ionic.starter -c android.intent.category.LAUNCHER 1
```

Esse fluxo foi validado no setup WSL + Android Studio no Windows.

### Opcao B (Ionic CLI com live reload)

```bash
ionic capacitor run android -l --external
```

Se aparecer erro de SDK no `native-run`, use a Opcao A.

### Opcao C (abrindo Android Studio)

```bash
ionic cap open android
```

No Android Studio, selecione o emulador e clique em **Run**.

## 7) Fluxo rapido (resumo)

```bash
cd /mnt/c/dev/meu-app
ionic build
npx cap sync android
cd android
cmd.exe /C "set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr&& set PATH=%JAVA_HOME%\bin;%PATH%&& gradlew.bat installDebug"
cd ..
"/mnt/c/Users/rb/AppData/Local/Android/Sdk/platform-tools/adb.exe" shell monkey -p io.ionic.starter -c android.intent.category.LAUNCHER 1
```
