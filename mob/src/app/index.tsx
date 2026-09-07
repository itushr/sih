import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";

const features = [
  ["01", "Home", "Your public services, connected"],
  ["02", "Track applications", "See progress and next steps"],
  ["03", "Linked services", "Manage your connected services"],
  ["04", "Audits", "Review your data activity"],
  ["05", "Fetch on demand", "Request a fresh record"],
  ["06", "Consent", "Choose what you share"],
] as const;

export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.kicker}>INTEROP / CITIZEN</Text>
      <Text style={styles.title}>Your services, in one clear view.</Text>
      <Text style={styles.description}>Track applications, understand your data, and stay in control of every connection.</Text>
      <View style={styles.featureList}>
        {features.map(([number, title, detail]) => (
          <Pressable key={title} style={styles.feature}>
            <Text style={styles.number}>{number}</Text>
            <View style={styles.featureCopy}>
              <Text style={styles.featureTitle}>{title}</Text>
              <Text style={styles.featureDetail}>{detail}</Text>
            </View>
            <Text style={styles.arrow}>-&gt;</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 28,
    paddingTop: 72,
    backgroundColor: "#f8f7f2",
  },
  kicker: {
    color: "#6c8c5d",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    maxWidth: 360,
    marginTop: 18,
    color: "#23483f",
    fontFamily: "Georgia",
    fontSize: 42,
    lineHeight: 48,
  },
  description: {
    maxWidth: 340,
    marginTop: 15,
    color: "#74847a",
    fontSize: 15,
    lineHeight: 23,
  },
  featureList: {
    gap: 10,
    width: "100%",
    marginTop: 42,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 74,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e7dc",
    backgroundColor: "#ffffff",
  },
  number: {
    width: 34,
    color: "#9fbd63",
    fontSize: 11,
    fontWeight: "800",
  },
  featureCopy: {
    flex: 1,
  },
  featureTitle: {
    color: "#33564c",
    fontSize: 14,
    fontWeight: "700",
  },
  featureDetail: {
    marginTop: 5,
    color: "#84948a",
    fontSize: 11,
  },
  arrow: {
    color: "#77a06c",
    fontSize: 17,
  },
});
