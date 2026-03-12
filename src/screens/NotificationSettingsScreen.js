import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Switch,
    Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';
import BottomNav from '../components/BottomNav';

export default function NotificationSettingsScreen({ onBack, onNavigate }) {
    const { colors } = useTheme();
    const [settings, setSettings] = useState({
        dailyReminders: true,
        budgetAlerts: true,
        weeklyReports: false,
        newFeatures: true,
    });

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const s = getStyles(colors);

    return (
        <View style={s.container}>
            {/* ── Fixed Header ── */}
            <View style={s.topBar}>
                <View style={s.headerRow}>
                    <Pressable onPress={onBack} hitSlop={12}>
                        <MaterialCommunityIcons name="arrow-left" size={26} color={colors.textPrimary} />
                    </Pressable>
                    <Text style={s.headerTitle}>Notification Settings</Text>
                    <View style={{ width: 28 }} />
                </View>
            </View>

            <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
                {/* ── REMINDERS & ALERTS ── */}
                <Text style={s.sectionLabel}>REMINDERS & ALERTS</Text>
                <View style={s.card}>
                    <SettingRow
                        title="Daily Reminders"
                        description="A gentle nudge to log your daily expenses every evening."
                        value={settings.dailyReminders}
                        onToggle={() => toggleSetting('dailyReminders')}
                        colors={colors}
                    />
                    <SettingRow
                        title="Budget Alerts"
                        description="Get notified when you're close to your category limits."
                        value={settings.budgetAlerts}
                        onToggle={() => toggleSetting('budgetAlerts')}
                        colors={colors}
                    />
                    <SettingRow
                        title="Weekly Reports"
                        description="Summarized insights of your spending patterns every Sunday."
                        value={settings.weeklyReports}
                        onToggle={() => toggleSetting('weeklyReports')}
                        colors={colors}
                    />
                    <SettingRow
                        title="New Features"
                        description="Stay updated with the latest tools and budget hacks."
                        value={settings.newFeatures}
                        onToggle={() => toggleSetting('newFeatures')}
                        colors={colors}
                        isLast
                    />
                </View>

                {/* ── DELIVERY METHOD ── */}
                <Text style={s.sectionLabel}>DELIVERY METHOD</Text>
                <View style={s.card}>
                    <Pressable style={s.row}>
                        <View style={s.iconCircle}>
                            <MaterialCommunityIcons name="bell-outline" size={20} color={colors.accent} />
                        </View>
                        <Text style={s.rowLabel}>Push Notifications</Text>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
                    </Pressable>
                    <Pressable style={[s.row, { borderBottomWidth: 0 }]}>
                        <View style={s.iconCircle}>
                            <MaterialCommunityIcons name="email-outline" size={20} color={colors.accent} />
                        </View>
                        <Text style={s.rowLabel}>Email Updates</Text>
                        <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textMuted} />
                    </Pressable>
                </View>

                {/* ── Pro Tip ── */}
                <View style={s.proTipCard}>
                    <View style={s.proTipIcon}>
                        <MaterialCommunityIcons name="lightbulb-on" size={24} color={colors.accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={s.proTipTitle}>Pro Tip</Text>
                        <Text style={s.proTipText}>
                            Users who enable daily reminders are 40% more likely to reach their monthly savings goal.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <BottomNav activeTab="profile" onTabChange={onNavigate} />
        </View>
    );
}

const SettingRow = ({ title, description, value, onToggle, colors, isLast }) => (
    <View style={[styles.settingRow, isLast && { borderBottomWidth: 0 }]}>
        <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>{title}</Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>{description}</Text>
        </View>
        <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: '#D1D5DB', true: '#1A1C1E' }}
            thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
            ios_backgroundColor="#D1D5DB"
        />
    </View>
);

const getStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.backgroundPrimary },
    topBar: {
        paddingTop: 56,
        paddingHorizontal: 20,
        paddingBottom: 12,
        backgroundColor: colors.backgroundPrimary,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 100,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#94A3B8',
        letterSpacing: 1.2,
        marginBottom: 12,
        marginTop: 12,
    },
    card: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.backgroundPrimary,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.backgroundPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rowLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    proTipCard: {
        backgroundColor: '#F7F1E1', // Warmer tip background
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    proTipIcon: {
        marginTop: 2,
    },
    proTipTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 4,
    },
    proTipText: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
});

const styles = StyleSheet.create({
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    settingDesc: {
        fontSize: 13,
        lineHeight: 18,
    },
});
