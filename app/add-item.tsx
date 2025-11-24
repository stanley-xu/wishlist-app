import { Button, Input, Text } from "@/components";
import { Features } from "@/config";
import { wishlistItems, wishlists } from "@/lib/api";
import {
  CreateWishlistItemSchema,
  type CreateWishlistItem,
} from "@/lib/schemas";
import { colours, spacing } from "@/styles/tokens";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

export default function AddItemScreen() {
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create wishlist on mount
  useEffect(() => {
    const initWishlist = async () => {
      const { data, error } = await wishlists.getAll();

      if (error) {
        console.error("Error fetching wishlists:", error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        // Use first wishlist (or only one if multi-wishlists is off)
        setWishlistId(data[0].id);
      } else if (!Features["multi-wishlists"]) {
        // Auto-create default wishlist
        const { data: newWishlist, error: createError } = await wishlists.create({
          name: "My Wishlist",
        });

        if (createError || !newWishlist) {
          console.error("Error creating default wishlist:", createError);
        } else {
          setWishlistId(newWishlist.id);
        }
      }

      setLoading(false);
    };

    initWishlist();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateWishlistItem>({
    resolver: zodResolver(CreateWishlistItemSchema),
    defaultValues: {
      name: "",
      url: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateWishlistItem) => {
    if (!wishlistId) {
      console.error("No wishlist available");
      return;
    }

    const { error } = await wishlistItems.create(wishlistId, data);

    if (error) {
      console.error("Error creating wishlist item:", error);
      return;
    }

    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.content}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Button variant="outline" size="sm" onPress={handleCancel}>
          <Text>Cancel</Text>
        </Button>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Add Item</Text>
        <Button
          size="sm"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting || !wishlistId}
        >
          <Text>Save</Text>
        </Button>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Item name"
              placeholder="What do you want?"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              autoFocus
            />
          )}
        />

        <Controller
          control={control}
          name="url"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Link (optional)"
              placeholder="https://..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.url?.message}
              keyboardType="url"
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Notes (optional)"
              placeholder="Size, color, etc."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.description?.message}
              multiline
              numberOfLines={3}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colours.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.md,
  },
});
