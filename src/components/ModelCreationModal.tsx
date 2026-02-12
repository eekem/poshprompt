"use client";

import { useState } from "react";

interface ModelCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModelCreated: (model: any) => void;
  challengeTitle: string;
  userId: string;
}

const MODEL_IMAGES = [
  "robot", "smart_toy", "psychology", "memory", "analytics", 
  "insights", "lightbulb", "auto_awesome", "precision_manufacturing",
  "biotech", "science", "rocket_launch", "engineering", "data_object",
  "cloud", "hub", "device_hub", "settings_suggest", "model_training",
  "neurology", "track_changes", "grain", "cyclone", "water_drop"
];

export default function ModelCreationModal({ isOpen, onClose, onModelCreated, challengeTitle, userId }: ModelCreationModalProps) {
  const [modelName, setModelName] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!modelName.trim() || !selectedImage) {
      alert("Please enter a model name and select an image");
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch(`/api/challenge/${window.location.pathname.split('/')[2]}/model`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          title: modelName.trim(),
          image: selectedImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create model");
      }

      onModelCreated(data.model);
      onClose();
      setModelName("");
      setSelectedImage("");

    } catch (error) {
      console.error("Error creating model:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to create model"}`);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-surface-dark border border-[#332a1e] rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Create Your AI Model</h2>
            <p className="text-gray-400">
              Give your model a name and choose an avatar for the "{challengeTitle}" challenge
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Model Name Input */}
          <div>
            <label htmlFor="modelName" className="block text-sm font-medium text-white mb-2">
              Model Name
            </label>
            <input
              id="modelName"
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Enter a creative name for your AI model..."
              className="w-full px-4 py-3 bg-background-dark border border-[#332a1e] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              minLength={3}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Minimum 3 characters
            </p>
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Choose Avatar
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
              {MODEL_IMAGES.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedImage === image
                      ? "border-primary bg-primary/20"
                      : "border-[#332a1e] bg-surface-dark hover:border-[#4a3f2e]"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl text-white">
                    {image}
                  </span>
                </button>
              ))}
            </div>
            {selectedImage && (
              <p className="text-xs text-gray-400 mt-2">
                Selected: {selectedImage}
              </p>
            )}
          </div>

          {/* Preview */}
          {modelName && selectedImage && (
            <div className="p-4 bg-background-dark border border-[#332a1e] rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Preview:</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">
                    {selectedImage}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{modelName}</h3>
                  <p className="text-xs text-gray-400">AI Model for {challengeTitle}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-surface-dark border border-[#332a1e] text-white rounded-lg hover:bg-surface-dark/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!modelName.trim() || !selectedImage || isCreating}
              className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? "Creating..." : "Create Model"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
