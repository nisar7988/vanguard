import { useAlertStore } from "@/src/store/use-alert-store";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export function CustomAlert() {
  const { visible, title, message, buttons, hideAlert } = useAlertStore();

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <View className="flex-1 items-center justify-center px-6">
        {/* BACKDROP */}
        <Pressable
          onPress={hideAlert}
          className="absolute inset-0 bg-black/60"
        />

        {/* ALERT BOX */}
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(150)}
          className="w-full max-w-[320px] bg-zinc-900 rounded-3xl overflow-hidden shadow-xl"
        >
          {/* CONTENT */}
          <View className="px-6 py-6 items-center">
            <Text className="text-white text-lg font-bold text-center mb-2">
              {title}
            </Text>

            <Text className="text-gray-400 text-sm text-center leading-5">
              {message}
            </Text>
          </View>

          {/* BUTTONS */}
          <View className="flex-row border-t border-zinc-800">
            {buttons.map((button, index) => {
              const isPrimary =
                button.style !== "cancel" &&
                button.style !== "destructive" &&
                buttons.length > 1;

              const isSingle = buttons.length === 1;
              const isAction = isPrimary || isSingle;

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  className={`flex-1`}
                  onPress={() => {
                    hideAlert();
                    button.onPress?.();
                  }}
                >
                  <View
                    className={`py-4 items-center justify-center ${
                      index > 0 && !isAction ? "border-l border-zinc-800" : ""
                    }`}
                  >
                    {isAction ? (
                      <LinearGradient
                        colors={["#ff7a18", "#ff3d00"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="absolute inset-0"
                      />
                    ) : null}

                    <Text
                      className={`text-base font-semibold ${
                        isAction
                          ? "text-white"
                          : button.style === "cancel"
                            ? "text-gray-400 font-normal"
                            : button.style === "destructive"
                              ? "text-red-500"
                              : "text-orange-400"
                      }`}
                    >
                      {button.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
