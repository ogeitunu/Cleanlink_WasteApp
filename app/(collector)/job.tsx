import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "@/lib/supabase";

export default function JobsScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "pending");

    if (error) {
      console.log("Fetch error:", error);
    } else {
      setJobs(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  if (!jobs.length) {
    return (
      <View style={styles.center}>
        <Text>No jobs available</Text>

        <TouchableOpacity onPress={fetchJobs}>
          <Text style={styles.link}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Jobs</Text>

      {jobs.map((job) => (
        <View key={job.id} style={styles.card}>
          <Text>{job.address}</Text>
          <Text>{job.waste_type}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  link: { color: "blue", marginTop: 10 },
});