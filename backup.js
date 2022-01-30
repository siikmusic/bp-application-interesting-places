        <ImageBackground
          source={require("../assets/signin.jpg")}
          style={{
            height: Dimensions.get("window").height / 2.5,
            width: "100%",
          }}
        >
          <View style={styles.placeIcon}>
            <MaterialIcons name="place" size={150} color="white" />
            <Text style={styles.heading1White}>INTERESTING PLACES</Text>
          </View>
        </ImageBackground>
        
        <View style={styles.header}>
          <Text style={styles.heading1}>Sign In</Text>
          <Text style={styles.heading2}>
            Use your credentials to login or sign up below.
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.buttonOutlineTextBlueNoCenter}>E-mail</Text>

          <TextInput
            placeholder="Your E-mail"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.buttonOutlineTextBlueNoCenter}>Password</Text>
          <TextInput
            placeholder="Your password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            style={styles.input}
            secureTextEntry
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin} style={styles.button1}>
            <Text style={styles.buttonOutlineTextWhite}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2}>
            <Text onPress={handleSignUp} style={styles.buttonOutlineTextBlue}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        <Text onPress={handleForgotPassword} style={styles.textForgot}>
          Forgot password?
        </Text>