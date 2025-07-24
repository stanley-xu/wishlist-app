import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Button, Card } from '@/components';
import { colors, spacing, typography } from '@/lib/tokens';

export default function ButtonShowcase() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const toggleLoading = (key: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const variants = ['primary', 'secondary', 'outline'] as const;
  const sizes = ['sm', 'md', 'lg'] as const;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Button Showcase</Text>
      <Text style={styles.subtitle}>All button variations for testing</Text>

      {/* Variants Section */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Variants</Text>
        {variants.map((variant) => (
          <View key={variant} style={styles.row}>
            <Text style={styles.label}>{variant}:</Text>
            <Button
              title={`${variant} Button`}
              variant={variant}
              onPress={() => console.log(`${variant} pressed`)}
            />
          </View>
        ))}
      </Card>

      {/* Sizes Section */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Sizes</Text>
        {sizes.map((size) => (
          <View key={size} style={styles.row}>
            <Text style={styles.label}>{size}:</Text>
            <Button
              title={`${size.toUpperCase()} Button`}
              size={size}
              onPress={() => console.log(`${size} pressed`)}
            />
          </View>
        ))}
      </Card>

      {/* Loading States Section */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Loading States</Text>
        {variants.map((variant) => (
          <View key={`loading-${variant}`} style={styles.row}>
            <Text style={styles.label}>{variant} loading:</Text>
            <Button
              title={loadingStates[variant] ? 'Loading...' : 'Click to Load'}
              variant={variant}
              loading={loadingStates[variant]}
              onPress={() => toggleLoading(variant)}
            />
          </View>
        ))}
      </Card>

      {/* Disabled States Section */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Disabled States</Text>
        {variants.map((variant) => (
          <View key={`disabled-${variant}`} style={styles.row}>
            <Text style={styles.label}>{variant} disabled:</Text>
            <Button
              title="Disabled Button"
              variant={variant}
              disabled={true}
              onPress={() => console.log('This should not fire')}
            />
          </View>
        ))}
      </Card>

      {/* All Combinations Grid */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>All Combinations</Text>
        {variants.map((variant) => (
          <View key={`grid-${variant}`} style={styles.gridSection}>
            <Text style={styles.gridTitle}>{variant.toUpperCase()}</Text>
            {sizes.map((size) => (
              <View key={`${variant}-${size}`} style={styles.row}>
                <Text style={styles.label}>{size}:</Text>
                <Button
                  title={`${variant} ${size}`}
                  variant={variant}
                  size={size}
                  onPress={() => console.log(`${variant} ${size} pressed`)}
                />
              </View>
            ))}
          </View>
        ))}
      </Card>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    flex: 1,
    textTransform: 'capitalize',
  },
  gridSection: {
    marginBottom: spacing.lg,
  },
  gridTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  spacer: {
    height: spacing.xl,
  },
});