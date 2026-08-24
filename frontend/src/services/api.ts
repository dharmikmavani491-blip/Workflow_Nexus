import axios from 'axios';
import {
  WorkflowData,
  Solution,
  KnowledgeStats,
  AgentExecutionResult,
  AgentDecision,
  WorkflowVersion,
  FeedbackItem,
} from '../types';

const API_BASE = '/api';

export const api = {
  // Task & Workflow
  analyzeTask: async (task: string, options: any = {}) => {
    const res = await axios.post(`${API_BASE}/tasks/analyze`, { task, ...options });
    return res.data;
  },

  generateWorkflow: async (payload: {
    task: string;
    budget?: string;
    quality?: string;
    speed?: string;
    experience_level?: string;
    preferred_tools?: string[];
    restrictions?: string[];
    optimization_mode?: string;
  }): Promise<WorkflowData> => {
    const res = await axios.post(`${API_BASE}/workflows/generate`, payload);
    return res.data;
  },

  getWorkflow: async (id: string): Promise<WorkflowData> => {
    const res = await axios.get(`${API_BASE}/workflows/${id}`);
    return res.data;
  },

  optimizeWorkflow: async (payload: {
    workflow_id: string;
    optimization_mode: string;
    user_constraints?: string[];
    custom_budget?: string;
  }): Promise<WorkflowData> => {
    const res = await axios.post(`${API_BASE}/workflows/optimize`, payload);
    return res.data;
  },

  submitFeedback: async (workflowId: string, payload: {
    rating: number;
    comment?: string;
    failure_reasons?: string[];
  }) => {
    const res = await axios.post(`${API_BASE}/workflows/${workflowId}/feedback`, payload);
    return res.data;
  },

  getWorkflowVersions: async (workflowId: string): Promise<WorkflowVersion[]> => {
    const res = await axios.get(`${API_BASE}/workflows/${workflowId}/versions`);
    return res.data;
  },

  getUserHistory: async () => {
    const res = await axios.get(`${API_BASE}/workflows/history`);
    return res.data;
  },

  deleteHistoryItem: async (workflowId: string) => {
    const res = await axios.delete(`${API_BASE}/workflows/history/${workflowId}`);
    return res.data;
  },

  clearAllHistory: async () => {
    const res = await axios.delete(`${API_BASE}/workflows/history`);
    return res.data;
  },

  // Solutions
  getSolutions: async (params: { category?: string; type?: string; search?: string } = {}): Promise<Solution[]> => {
    const res = await axios.get(`${API_BASE}/solutions`, { params });
    return res.data;
  },

  getSolution: async (id: string): Promise<Solution> => {
    const res = await axios.get(`${API_BASE}/solutions/${id}`);
    return res.data;
  },

  // Knowledge Base
  getKnowledgeStats: async (): Promise<KnowledgeStats> => {
    const res = await axios.get(`${API_BASE}/knowledge/statistics`);
    return res.data;
  },

  triggerDatasetImport: async () => {
    const res = await axios.post(`${API_BASE}/knowledge/import`);
    return res.data;
  },

  // Adaptive Agent Simulation
  executeStep: async (payload: {
    workflow_id: string;
    step_number: number;
    force_failure_type?: string;
  }): Promise<AgentExecutionResult> => {
    const res = await axios.post(`${API_BASE}/agent/execute`, payload);
    return res.data;
  },

  getAdaptiveDecision: async (context: any): Promise<AgentDecision> => {
    const res = await axios.post(`${API_BASE}/agent/decision`, context);
    return res.data;
  },

  // Admin
  getAdminFeedbacks: async (): Promise<FeedbackItem[]> => {
    const res = await axios.get(`${API_BASE}/admin/feedbacks`);
    return res.data;
  },

  approveFeedback: async (feedbackId: string) => {
    const res = await axios.post(`${API_BASE}/admin/feedback/${feedbackId}/approve`);
    return res.data;
  },
};
