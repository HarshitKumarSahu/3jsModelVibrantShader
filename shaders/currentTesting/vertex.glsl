#include <skinning_pars_vertex> // Include Three.js skinning utilities

varying vec3 vWorldNormal;
varying vec3 vWorldPos;
varying vec2 vUv;

void main() {
    vUv = uv;

    // Initialize transformed as the vertex position
    vec3 transformed = vec3(position);

    // Skinning calculations
    #include <skinbase_vertex>
    #include <skinning_vertex>

    // Transform the skinned position to world space
    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vWorldPos = worldPosition.xyz;

    // Transform normal to world space (use inverse transpose for correct normal transformation)
    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    // Compute the final position
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}