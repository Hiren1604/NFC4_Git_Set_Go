import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_BASE_URL } from "@/constants";

export interface IssueItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "assigned" | "in-progress" | "resolved" | "closed" | "cancelled";
  reportedBy?: any;
  assignedTo?: any;
  location?: {
    flatNumber?: string;
    building?: string;
    area?: string;
  };
  photos?: any[];
  timeline?: any[];
  rating?: {
    score?: number;
    feedback?: string;
    submittedAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface IssuesState {
  items: IssueItem[];
  loading: boolean;
  error: string | null;
  activeIssue: IssueItem | null;
}

const initialState: IssuesState = {
  items: [],
  loading: false,
  error: null,
  activeIssue: null,
};

export const fetchIssues = createAsyncThunk(
  "issues/fetchIssues",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];
      const res = await fetch(`${API_BASE_URL}/issues`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch issues");
      }
      const data = await res.json();
      return (data.issues || []) as IssueItem[];
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch issues");
    }
  }
);

export const submitIssueRating = createAsyncThunk(
  "issues/submitRating",
  async (
    { id, score, feedback }: { id: string; score: number; feedback: string },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(`${API_BASE_URL}/issues/${id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score, feedback }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit rating");
      }
      const rating = await res.json();
      return { id, rating };
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to rate issue");
    }
  }
);

export const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    setIssues: (state, action: PayloadAction<IssueItem[]>) => {
      state.items = action.payload;
    },
    addIssue: (state, action: PayloadAction<IssueItem>) => {
      state.items.unshift(action.payload);
    },
    updateIssue: (state, action: PayloadAction<IssueItem>) => {
      const idx = state.items.findIndex((i) => i._id === action.payload._id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
      }
    },
    setActiveIssue: (state, action: PayloadAction<IssueItem | null>) => {
      state.activeIssue = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitIssueRating.fulfilled, (state, action) => {
        const { id, rating } = action.payload;
        const target = state.items.find((i) => i._id === id);
        if (target) {
          target.status = "resolved";
          target.rating = rating;
        }
      });
  },
});

export const { setIssues, addIssue, updateIssue, setActiveIssue } = issuesSlice.actions;
export default issuesSlice.reducer;
