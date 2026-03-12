import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FormInput } from '../components/FormInput';
import authService from '../services/authService';
import getRegisterStyles from '../styles/RegisterScreen.styles';
import { useTheme } from '../styles/theme';

// ─── Animation config ─────────────────────────────────────────────────────────
const EASING_ENTER = Easing.out(Easing.cubic);

/**
 * RegisterScreen
 *
 * Handles new account creation.
 * On success, calls onRegisterSuccess(data) which logs the user in immediately.
 *
 * @param {{ onBack: () => void, onSignInPress: () => void, onRegisterSuccess: (data: object) => void }} props
 */
export default function RegisterScreen({ onBack, onSignInPress, onRegisterSuccess }) {
    const { colors } = useTheme();
    const styles = React.useMemo(() => getRegisterStyles(colors), [colors]);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ── Entrance animated values ─────────────────────────────────────────────
    const headerAnim = useRef(new Animated.Value(0)).current;
    const heroAnim = useRef(new Animated.Value(0)).current;
    const heroSlideY = useRef(new Animated.Value(16)).current;
    const formAnim = useRef(new Animated.Value(0)).current;
    const formSlideY = useRef(new Animated.Value(20)).current;
    const buttonScale = useRef(new Animated.Value(0.92)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const bottomAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(55, [
            Animated.timing(headerAnim, {
                toValue: 1,
                duration: 340,
                easing: EASING_ENTER,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(heroAnim, {
                    toValue: 1,
                    duration: 370,
                    easing: EASING_ENTER,
                    useNativeDriver: true,
                }),
                Animated.timing(heroSlideY, {
                    toValue: 0,
                    duration: 370,
                    easing: EASING_ENTER,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(formAnim, {
                    toValue: 1,
                    duration: 400,
                    easing: EASING_ENTER,
                    useNativeDriver: true,
                }),
                Animated.timing(formSlideY, {
                    toValue: 0,
                    duration: 400,
                    easing: EASING_ENTER,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(buttonAnim, {
                    toValue: 1,
                    duration: 340,
                    easing: EASING_ENTER,
                    useNativeDriver: true,
                }),
                Animated.spring(buttonScale, {
                    toValue: 1,
                    friction: 6,
                    tension: 50,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(bottomAnim, {
                toValue: 1,
                duration: 280,
                easing: EASING_ENTER,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // ── Button press feedback ─────────────────────────────────────────────────
    const onPressIn = useCallback(() => {
        Animated.spring(buttonScale, { toValue: 0.96, friction: 4, useNativeDriver: true }).start();
    }, [buttonScale]);

    const onPressOut = useCallback(() => {
        Animated.spring(buttonScale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    }, [buttonScale]);

    // ── Submit handler ────────────────────────────────────────────────────────
    const handleCreateAccount = useCallback(async () => {
        if (!fullName.trim() || !email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const data = await authService.register(
                fullName.trim(),
                email.trim(),
                password,
            );
            onRegisterSuccess?.(data);
        } catch (err) {
            const serverError = err.response?.data;
            const message =
                err.message ||
                serverError?.email?.[0] ||
                serverError?.full_name?.[0] ||
                serverError?.password?.[0] ||
                serverError?.error ||
                'Something went wrong. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [fullName, email, password, onRegisterSuccess]);

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* ── Header ── */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: headerAnim,
                        transform: [
                            {
                                translateY: headerAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [-10, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <Pressable style={styles.headerBackButton} onPress={onBack} hitSlop={12}>
                    <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
                </Pressable>
                <Text style={styles.headerTitle}>Finovo</Text>
            </Animated.View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* ── Hero copy ── */}
                <Animated.View
                    style={{
                        opacity: heroAnim,
                        transform: [{ translateY: heroSlideY }],
                    }}
                >
                    <Text style={styles.heroTitle}>Create your account</Text>
                    <Text style={styles.heroSubtitle}>
                        Start your minimalist financial journey.
                    </Text>
                </Animated.View>

                {/* ── Form fields (filled variant, uppercase labels) ── */}
                <Animated.View
                    style={{
                        opacity: formAnim,
                        transform: [{ translateY: formSlideY }],
                    }}
                >
                    <FormInput
                        label="Full Name"
                        placeholder="Enter your full name"
                        autoCapitalize="words"
                        value={fullName}
                        onChangeText={setFullName}
                    />

                    <FormInput
                        label="Email Address"
                        placeholder="name@example.com"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <FormInput
                        label="Password"
                        placeholder="Create a password"
                        isPassword
                        value={password}
                        onChangeText={setPassword}
                    />
                </Animated.View>

                {/* ── Error message ── */}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* ── Create Account button ── */}
                <Animated.View
                    style={{
                        opacity: buttonAnim,
                        transform: [{ scale: buttonScale }],
                    }}
                >
                    <Pressable
                        style={[styles.createButton, loading && styles.createButtonDisabled]}
                        onPress={handleCreateAccount}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        disabled={loading}
                    >
                        <Text style={styles.createButtonLabel}>
                            {loading ? 'Creating account…' : 'Create Account'}
                        </Text>
                    </Pressable>
                </Animated.View>

                {/* ── Bottom — Sign In link ── */}
                <Animated.View style={[styles.bottomRow, { opacity: bottomAnim }]}>
                    <Text style={styles.bottomText}>Already have an account? </Text>
                    <Pressable onPress={onSignInPress} hitSlop={8}>
                        <Text style={styles.signInLink}>Sign In</Text>
                    </Pressable>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
