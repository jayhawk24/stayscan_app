import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Container from '@/components/ui/Container';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { spacing, colors } from '@/theme/tokens';
import { http } from '@/api/client';

export default function ManageHotelScreen() {
    const [hotel, setHotel] = useState<any | null>(null);
    const [tvGuides, setTvGuides] = useState<any[]>([]);
    const [wifiGuides, setWifiGuides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tvTitle, setTvTitle] = useState('');
    const [wifiName, setWifiName] = useState('');
    const [menus, setMenus] = useState<any[]>([]);
    const [menuName, setMenuName] = useState('');

    const tvTitleRef = useRef<TextInput>(null);
    const wifiNameRef = useRef<TextInput>(null);

    const load = async () => {
        setLoading(true);
        try {
            const [profile, tv, wifi, fm] = await Promise.all([
                http.get<{ success: boolean; hotel: any }>(`/hotel/profile`),
                http.get<{ success: boolean; data: any[] }>(`/hotel/setup/tv-guide`),
                http.get<{ success: boolean; data: any[] }>(`/hotel/setup/wifi`),
                http.get<{ success: boolean; data: any[] }>(`/hotel/setup/food-menu`),
            ]);
            setHotel(profile.hotel);
            setTvGuides(tv.data || []);
            setWifiGuides(wifi.data || []);
            setMenus(fm.data || []);
        } finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const addTvGuide = async () => {
        if (!tvTitle.trim()) return;
        await http.post(`/hotel/setup/tv-guide`, { title: tvTitle.trim() });
        setTvTitle('');
        await load();
    };

    const deleteTvGuide = async (id: string) => {
        await http.del(`/hotel/setup/tv-guide/${id}`);
        await load();
    };

    const addWifiGuide = async () => {
        if (!wifiName.trim()) return;
        await http.post(`/hotel/setup/wifi`, { hotelId: hotel?.id, networkName: wifiName.trim() });
        setWifiName('');
        await load();
    };

    const deleteWifiGuide = async (id: string) => {
        await http.del(`/hotel/setup/wifi/${id}`);
        await load();
    };

    const addFoodMenu = async () => {
        if (!menuName.trim()) return;
        await http.post(`/hotel/setup/food-menu`, { name: menuName.trim() });
        setMenuName('');
        await load();
    };

    const deleteFoodMenu = async (id: string) => {
        await http.del(`/hotel/setup/food-menu/${id}`);
        await load();
    };

    return (
        <LinearGradient colors={["#fffbeb", "#fef3c7"]} style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: 'height' })} keyboardVerticalOffset={80}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: spacing.xl, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
                        <Container>
                            <Text variant="title">Manage Hotel</Text>
                            <Text color={colors.text.secondary} style={{ marginBottom: spacing.lg }}>Manage hotel details, TV Guides and WiFi.</Text>

                            <Card>
                                <Text variant="subtitle">Hotel Information</Text>
                                {loading ? (
                                    <Text color={colors.text.secondary}>Loading…</Text>
                                ) : hotel ? (
                                    <View style={{ marginTop: spacing.sm }}>
                                        <Text>Name: {hotel.name}</Text>
                                        <Text>Rooms: {hotel.totalRooms}</Text>
                                        <Text>Email: {hotel.contactEmail}</Text>
                                        <Text>Phone: {hotel.contactPhone}</Text>
                                    </View>
                                ) : (
                                    <Text color={colors.text.secondary}>No hotel found.</Text>
                                )}
                            </Card>

                            <Card style={{ marginTop: spacing.md }}>
                                <Text variant="subtitle">TV Guides</Text>
                                <View style={{ height: spacing.sm }} />
                                {tvGuides.length === 0 ? (
                                    <Text color={colors.text.secondary}>No TV guides configured.</Text>
                                ) : (
                                    <View style={{ gap: spacing.xs }}>
                                        {tvGuides.map((g: any) => (
                                            <View key={g.id} style={styles.row}>
                                                <Text>{g.title}</Text>
                                                <Button title="Delete" onPress={() => deleteTvGuide(g.id)} />
                                            </View>
                                        ))}
                                    </View>
                                )}
                                <View style={{ height: spacing.sm }} />
                                <View style={styles.row}>
                                    <TextInput ref={tvTitleRef} value={tvTitle} onChangeText={setTvTitle} placeholder="Guide Title" style={styles.input} returnKeyType="done" />
                                    <Button title="Add" onPress={addTvGuide} />
                                </View>
                            </Card>

                            <Card style={{ marginTop: spacing.md }}>
                                <Text variant="subtitle">WiFi Networks</Text>
                                <View style={{ height: spacing.sm }} />
                                {wifiGuides.length === 0 ? (
                                    <Text color={colors.text.secondary}>No WiFi networks configured.</Text>
                                ) : (
                                    <View style={{ gap: spacing.xs }}>
                                        {wifiGuides.map((w: any) => (
                                            <View key={w.id} style={styles.row}>
                                                <Text>{w.networkName}</Text>
                                                <Button title="Delete" onPress={() => deleteWifiGuide(w.id)} />
                                            </View>
                                        ))}
                                    </View>
                                )}
                                <View style={{ height: spacing.sm }} />
                                <View style={styles.row}>
                                    <TextInput ref={wifiNameRef} value={wifiName} onChangeText={setWifiName} placeholder="WiFi Network Name" style={styles.input} returnKeyType="done" />
                                    <Button title="Add" onPress={addWifiGuide} />
                                </View>
                            </Card>

                            {/* Food Menus */}
                            <Card style={{ marginTop: spacing.md }}>
                                <Text variant="subtitle">Food Menus</Text>
                                <View style={{ height: spacing.sm }} />
                                {menus.length === 0 ? (
                                    <Text color={colors.text.secondary}>No food menus configured.</Text>
                                ) : (
                                    <View style={{ gap: spacing.xs }}>
                                        {menus.map((m: any) => (
                                            <View key={m.id} style={styles.row}>
                                                <Text>{m.name}</Text>
                                                <Button title="Delete" onPress={() => deleteFoodMenu(m.id)} />
                                            </View>
                                        ))}
                                    </View>
                                )}
                                <View style={{ height: spacing.sm }} />
                                <View style={styles.row}>
                                    <TextInput value={menuName} onChangeText={setMenuName} placeholder="Menu Name" style={styles.input} returnKeyType="done" />
                                    <Button title="Add" onPress={addFoodMenu} />
                                </View>
                            </Card>
                        </Container>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
    input: { flex: 1, borderColor: '#ddd', borderWidth: 1, padding: 10, borderRadius: 6 },
});
